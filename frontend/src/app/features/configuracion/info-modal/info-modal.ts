import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslocoModule],
  templateUrl: './info-modal.html',
})
export class InfoModalComponent implements OnInit {
  userAgent: string = '';

  ngOnInit() {
    this.userAgent = window.navigator.userAgent;
  }
}
