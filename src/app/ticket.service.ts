import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/tickets';

  constructor(private http: HttpClient) { }

  getTickets(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  updateTicket(id: number, ticket: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
