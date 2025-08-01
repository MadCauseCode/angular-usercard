import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
  _id: string;
  name: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    zipcode?: number;
  };
  tasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  posts?: {
    id: string;
    title: string;
    body: string;
  }[];
}

const USERS_URL = 'http://localhost:3000/users';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './MainPage.html',
  styleUrl: './MainPage.css',
})
export class MainPage {
  users: User[] = [];
  user: User | null = null;

  addingUserState: boolean = false;
  newUserName: string = '';
  newUserEmail: string = '';

  showExtraDataUserId: string | null = null;

  selectedUserId: string | null = null;

  addingTaskUserId: string | null = null;
  newTaskTitle: string = '';
  
  addingPostUserId: string | null = null;
  newPostTitle: string = '';
  newPostBody: string = '';
  

  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get<User[]>(USERS_URL).subscribe((data) => {
      this.users = data.map((user) => ({
        ...user,
        address: user.address ?? { street: '', city: '', zipcode: 0 },
      }));
    });
  }


  
  toggleAddUser() {
    this.addingUserState = !this.addingUserState;
    this.newUserName = '';
    this.newUserEmail = '';
  }
  
  addUser() {
    const name = this.newUserName.trim();
    const email = this.newUserEmail.trim();
  
    if (!name || !email) return;
  
    const newUser: Partial<User> = {
      name,
      email,
      address: { street: '', city: '', zipcode: 0 },
      tasks: [],
      posts: [],
    };
  
    this.http.post<User>(USERS_URL, newUser).subscribe({
      next: (user) => {
        this.users.push(user);
        this.newUserName = '';
        this.newUserEmail = '';
        this.addingUserState = false;
        window.location.reload()
      },
      error: (err) => console.error('Failed to add user:', err),
    });
  }
  

  searchUser(query: string) {
    const search = query.toLowerCase();
    this.http.get<User[]>(USERS_URL).subscribe((data) => {
      this.users = data.filter((user) => {
        return user.name.toLowerCase().includes(search);
      });
    });
  }

  allTasksCompleted(user: User): boolean {
    if (!user?.tasks || !Array.isArray(user.tasks)) {
      return false; // or true, if you'd rather assume no tasks = completed
    }
  
    return user.tasks.every(task => task.completed);
  }

  otherData(userId: string) {
    this.showExtraDataUserId =
      this.showExtraDataUserId === userId ? null : userId;
  }

  updateUser(
    user: User,
    name: string,
    email: string,
    street?: string,
    city?: string,
    zipcode?: string | number
  ) {
    const updatedUser: User = {
      ...user,
      name,
      email,
      address: {
        street: street ?? '',
        city: city ?? '',
        zipcode: Number(zipcode) || 0,
      },
    };

    const url = `${USERS_URL}/${user._id}`;
    this.http.put<User>(url, updatedUser).subscribe({
      next: (res) => console.log('User updated:', res),
      error: (err) => console.error('Update failed:', err),
    });
  }

  deleteUser(userId: string) {
    const url = `${USERS_URL}/${userId}`;
    this.http.delete<User>(url).subscribe({
      next: (res) => {
        console.log('User deleted:', res);
        this.users = this.users.filter((user) => user._id !== userId);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  selectUser(userId: string) {
    this.selectedUserId = this.selectedUserId === userId ? null : userId;
  }

  completeTask(user: User, taskId: string) {
    const task = user.tasks?.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    task.completed = true;

    this.http.put(`${USERS_URL}/${user._id}`, { tasks: user.tasks }).subscribe({
      next: () =>
        console.log(` User: ${user.name}'s Task ${taskId} marked complete`),
      error: (err) => console.error('Error updating task:', err),
    });
  }

  addTask(user: User) {
    if (!this.newTaskTitle.trim()) return;

    const nextId =
      Math.max(0, ...(user.tasks ?? []).map((t) => +t.id || 0)) + 1;

    const newTask = {
      id: nextId.toString(),
      title: this.newTaskTitle.trim(),
      completed: false,
    };

    const updatedTasks = [...(user.tasks ?? []), newTask];

    this.http
      .put(`${USERS_URL}/${user._id}`, { tasks: updatedTasks })
      .subscribe({
        next: () => {
          user.tasks = updatedTasks;
          console.log(`Task added to ${user.name}: ${this.newTaskTitle}`);
          this.newTaskTitle = '';
          this.addingTaskUserId = null;
        },
        error: (err) => console.error('Error adding task:', err),
      });
  }

  addPost(user: User) {
    if (!this.newPostTitle.trim()) return;

    const nextId =
      Math.max(0, ...(user.posts ?? []).map((p) => +p.id || 0)) + 1;

    const newPost = {
      id: nextId.toString(),
      title: this.newPostTitle.trim(),
      body: this.newPostBody.trim(),
    };

    const updatedPosts = [...(user.posts ?? []), newPost];

    this.http
      .put(`${USERS_URL}/${user._id}`, { posts: updatedPosts })
      .subscribe({
        next: () => {
          user.posts = updatedPosts;
          this.newPostTitle = '';
          this.newPostBody = '';
          this.addingPostUserId = null;
          console.log('Post added');
        },
        error: (err) => console.error('Error adding post:', err),
      });
  }
}
