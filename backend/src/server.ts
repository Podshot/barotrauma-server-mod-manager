require("dotenv").config({ path: `.env` });
import express from 'express';
import cors from 'cors';
import {XMLParser, XMLBuilder} from 'fast-xml-parser'
import { writeFileSync, readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'node:path';
import BarotraumaMod from './BarotraumaMod';
import ModStatus from './ModStatus';
import BarotraumaConfig from './BarotraumaConfig';

const app = express();
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(resolve(__dirname, "frontend")))

const barotraumaPath = process.env.BAROTRAUMA_PATH || '/barotrauma'

const modPathRegex = /LocalMods\/(?<modID>\d+)\/filelist\.xml/

const xmlParser = new XMLParser({ignoreAttributes: false})
const xmlBuilder = new XMLBuilder({format: true, ignoreAttributes: false, suppressBooleanAttributes: false, suppressEmptyNode: true})

const getDirectories = (path: string) => {
  return readdirSync(path).filter(function (file) {
    return statSync(path+'/'+file).isDirectory();
  });
}

const readConfigPlayerXML = (): BarotraumaConfig | null => {
    if (!existsSync(join(barotraumaPath, 'config_player.xml'))) {
        console.log(`File doesn't exists at path: ${join(barotraumaPath, 'config_player.xml')}`)
        return null;
    }
    const fileData = readFileSync(join(barotraumaPath, 'config_player.xml'), 'utf-8')
    const xmlData = xmlParser.parse(fileData, true)
    return xmlData;
}

const loadMods = (data: BarotraumaConfig | null): BarotraumaMod[] => {
    if (data == null) {
        return [];
    }
    const mods: BarotraumaMod[] = [];
    const configMods = data.config.contentpackages.regularpackages.package;
    for (let i = 0; i < configMods.length; i++) {
        const mod = configMods[i];
        const modPath: string = mod['@_path'];
        const modId = modPathRegex.exec(modPath)!.groups!.modID
        const modName = getModName(join(barotraumaPath, modPath));
        mods.push({
            id: modId,
            name: modName,
            path: modPath,
            status: ModStatus.ENABLED
        })
    }
    const configModIDs = mods.map(m => m.id);
    const modDirectories = getDirectories(join(barotraumaPath, 'LocalMods')).filter(d => !configModIDs.includes(d));
    for (let i = 0; i < modDirectories.length; i++) {
        const modPath = join(barotraumaPath, 'LocalMods', modDirectories[i], 'filelist.xml');
        const modName = getModName(modPath);
        mods.push({
            id: modDirectories[i],
            name: modName,
            path: join('LocalMods', modDirectories[i], 'filelist.xml'),
            status: ModStatus.DISABLED
        })
    }
    return mods;
}

const saveMods = (): boolean => {
    const configPath = join(barotraumaPath, 'config_player.xml');
    writeFileSync(join(barotraumaPath, 'config_player_backup.xml'), readFileSync(join(barotraumaPath, 'config_player.xml')));
    const config = readConfigPlayerXML();
    if (config == null) {
        return false;
    }
    config.config.contentpackages.regularpackages.package = barotraumaMods.filter(m => m.status === ModStatus.ENABLED).map(m => {
        return {
            "@_path": m.path,
            "@_enabled": 'true',
            "@__name": m.name
        }
    })
    const xmlData = xmlBuilder.build(config);
    writeFileSync(configPath, xmlData);
    return true;
}

const getModName = (path: string): string => {
    const fileData = readFileSync(path, 'utf-8')
    const xmlData = xmlParser.parse(fileData, true)
    return xmlData.contentpackage['@_name'];
}

let barotraumaMods: BarotraumaMod[] = []

app.get('/mods', async (req, res) => {
    res.json(barotraumaMods);
});

app.post('/save', async (req, res) => {
    const mods = req.body;
    const modIDs = Object.keys(mods);
    for (let i = 0; i < modIDs.length; i++) {
        const modID = modIDs[i];
        const mod = barotraumaMods.filter(m => m.id === modID);
        if (mod.length < 1) {
            continue;
        }
        mod[0].status = mods[modID] === 'enabled' ? ModStatus.ENABLED : ModStatus.DISABLED
    }
    const result = saveMods();
    res.json({success: result})
})

app.post('/reload', async (_, res) => {
    barotraumaMods = loadMods(readConfigPlayerXML());
    res.json({success: true});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    barotraumaMods = loadMods(readConfigPlayerXML())
});