import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BackendService, BarotraumaMod } from './services/backend.service';
import { ModComponent } from "./components/mod/mod.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, ModComponent]
})
export class AppComponent implements OnInit {
  title = 'frontend';

  mods: BarotraumaMod[] = [];

  constructor(protected backend: BackendService) {}

  ngOnInit(): void {
      this.backend.getMods().subscribe(_mods => this.mods = _mods)
  }

  saveMods() {
    console.dir(this.mods);
    this.backend.saveMods(this.mods);
  }

  reloadMods() {
    this.backend.reloadMods().subscribe(_mods => this.mods = _mods)
  }
}
