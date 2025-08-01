import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

const USERS_URL = 'http://localhost:3000/products';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Project 2 - Angular + DB';
}
