import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { PlayerBar } from './shared/player-bar/player-bar';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, PlayerBar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}