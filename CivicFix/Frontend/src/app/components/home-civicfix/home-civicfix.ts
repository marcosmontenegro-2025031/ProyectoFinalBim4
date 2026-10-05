import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-civicfix',
    standalone: true,
    templateUrl: './home-civicfix.html',
    styleUrls: ['./home-civicfix.css']
})
export class HomeCivicfixComponent implements AfterViewInit {

    @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

    constructor(private router: Router) {}

    ngAfterViewInit(): void {
        const video = this.heroVideo?.nativeElement;

        if (video) {
            video.muted = true;
            video.autoplay = true;
            video.loop = true;
            video.playsInline = true;

            video.play().catch(() => {});
        }
    }

    irLogin(): void {
        this.router.navigate(['/formulario']);
    }

    irRegistro(): void {
        this.router.navigate(['/formulario']);
    }

}