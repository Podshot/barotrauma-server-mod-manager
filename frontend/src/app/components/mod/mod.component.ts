import { Component, Input } from '@angular/core';
import { BarotraumaMod } from '../../services/backend.service';

@Component({
  selector: 'mod',
  standalone: true,
  templateUrl: './mod.component.html',
  styleUrl: './mod.component.css'
})
export class ModComponent {
  @Input()
  modData?: BarotraumaMod;

  toggleStatus() {
    if (this.modData == null) {
      return;
    }
    this.modData.status = this.modData.status === "enabled" ? "disabled" : "enabled"
  }

}
