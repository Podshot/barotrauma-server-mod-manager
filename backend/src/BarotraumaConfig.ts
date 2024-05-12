interface BarotraumaConfigMod {
    "@_path": string,
    "@_enabled": 'true' | 'false',
    "@__name": string
}

export interface BarotraumaConfig {
    config: {
        contentpackages: {
            regularpackages: {
                package: BarotraumaConfigMod[]
            }
        }
    }
}

export default BarotraumaConfig;