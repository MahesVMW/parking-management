import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookedSlots: any[] = [];

  getBookedSlots() {
    return this.bookedSlots;
  }

  addBookedSlot(slot: any) {
    this.bookedSlots.push(slot);
  }
}
