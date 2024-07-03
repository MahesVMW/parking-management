import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parking-management',
  templateUrl: './parking-management.component.html',
  styleUrls: ['./parking-management.component.scss']
})
export class ParkingManagementComponent {
  selectedFloor: number | null = 1; // Default to floor 1
  selectedSlot: any = null;
  notification: string | null = null;
  errorMessage: string | null = null;
  isEntryFormSubmitted: boolean = false;
  isCheckoutFormSubmitted: boolean = false;
  bookedSlots: any[] = []; // Array to store booked slots
  billAmount: number | null = null; // Store the bill amount

  entryForm: FormGroup;
  checkoutForm: FormGroup;

  floors = [
    { floor: 1, slots: Array(10).fill({}).map((_, i) => this.createSlot(i)) },
    { floor: 2, slots: Array(15).fill({}).map((_, i) => this.createSlot(i)) },
    { floor: 3, slots: Array(20).fill({}).map((_, i) => this.createSlot(i)) }
  ];

  constructor(private fb: FormBuilder) {
    this.entryForm = this.fb.group({
      spotNo: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      inTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    });

    this.checkoutForm = this.fb.group({
      outTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    });
  }

  get slots() {
    return this.floors.find(f => f.floor === this.selectedFloor)?.slots || [];
  }

  createSlot(index: number) {
    return {
      spotNo: index + 1,
      vehicleNo: '',
      phoneNo: '',
      inTime: '',
      outTime: '',
      booked: false
    };
  }

  selectFloor(floor: number) {
    this.selectedFloor = floor;
  }

  openSlot(slot: any) {
    this.selectedSlot = slot;
    this.isEntryFormSubmitted = false;
    this.isCheckoutFormSubmitted = false;
    this.billAmount = null;
    if (!slot.booked) {
      this.entryForm.reset({
        spotNo: slot.spotNo,
        vehicleNo: '',
        phoneNo: '',
        inTime: ''
      });
    }
  }

  bookSlot() {
    this.isEntryFormSubmitted = true;
    if (this.entryForm.valid) {
      this.selectedSlot.vehicleNo = this.entryForm.value.vehicleNo;
      this.selectedSlot.phoneNo = this.entryForm.value.phoneNo;
      this.selectedSlot.inTime = this.entryForm.value.inTime;
      this.selectedSlot.booked = true;
      this.bookedSlots.push({ ...this.selectedSlot, floor: this.selectedFloor }); // Add to booked slots array
      this.showNotification(`Slot ${this.selectedSlot.spotNo} booked successfully.`);
      this.selectedSlot = null;
      this.errorMessage = null;
    }
  }

  markOut() {
    this.isCheckoutFormSubmitted = true;
    if (this.checkoutForm.valid) {
      const outTime = this.checkoutForm.value.outTime;
      const inTime = this.selectedSlot.inTime;

      const duration = this.calculateDuration(inTime, outTime);
      this.billAmount = this.calculateBill(duration);

      this.selectedSlot.booked = false;
      this.selectedSlot.vehicleNo = '';
      this.selectedSlot.phoneNo = '';
      this.selectedSlot.inTime = '';
      this.selectedSlot.outTime = '';
      this.showNotification(`Slot ${this.selectedSlot.spotNo} marked out successfully. Bill Amount: ${this.billAmount} Rs`);
      this.selectedSlot = null;
      this.errorMessage = null;
    }
  }

  calculateDuration(inTime: string, outTime: string): number {
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    const [outHours, outMinutes] = outTime.split(':').map(Number);

    const inDate = new Date();
    inDate.setHours(inHours, inMinutes);

    const outDate = new Date();
    outDate.setHours(outHours, outMinutes);

    const diff = (outDate.getTime() - inDate.getTime()) / 1000 / 60; // difference in minutes
    return diff;
  }

  calculateBill(duration: number): number {
    if (duration <= 15) {
      return 10;
    } else if (duration <= 30) {
      return 25;
    } else if (duration <= 60) {
      return 60;
    } else {
      return Math.ceil(duration / 1440) * 200; // charge per day
    }
  }

  closeSlot() {
    this.selectedSlot = null;
    this.errorMessage = null;
    this.billAmount = null;
  }

  showNotification(message: string) {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  getBackgroundColor(floor: number) {
    switch (floor) {
      case 1:
        return '#FFD700'; // Gold for Floor 1
      case 2:
        return '#ADD8E6'; // Light Blue for Floor 2
      case 3:
        return '#90EE90'; // Light Green for Floor 3
      default:
        return '#FFFFFF'; // Default White
    }
  }
}
