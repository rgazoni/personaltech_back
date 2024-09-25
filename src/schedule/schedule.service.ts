import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import { addHours, isBefore, parseISO, format } from 'date-fns';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationService } from 'src/common/notification/notification.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

  // Create an availability rule
  async createAvailabilityRule(createAvailabilityDto: CreateAvailabilityDto) {
    const { personal_id, startTime, endTime, daysOfWeek } =
      createAvailabilityDto;

    // Validate time format (HH:MM:SS)
    if (
      !/^\d{2}:\d{2}:\d{2}$/.test(startTime) ||
      !/^\d{2}:\d{2}:\d{2}$/.test(endTime)
    ) {
      throw new BadRequestException('Invalid time format. Use HH:MM:SS.');
    }

    // Validate daysOfWeek
    if (!Array.isArray(daysOfWeek) || daysOfWeek.some((day) => day < 0 || day > 6)) {
      throw new BadRequestException('daysOfWeek must be an array of integers from 0 to 6.');
    }

    // Create the availability rule
    const availabilityRule = await this.prisma.availabilityRule.create({
      data: {
        personal_id,
        startTime,
        endTime,
        daysOfWeek,
      },
    });

    return availabilityRule;
  }

  // Get availability rules for a professional
  async getAvailabilityRules(personal_id: string) {
    const availabilityRules = await this.prisma.availabilityRule.findMany({
      where: { personal_id },
    });

    return availabilityRules;
  }

  // Get available hourly time slots for a professional on a specific date
  async getAvailableSlots(personal_id: string, date: string) {
    // Parse the date
    const selectedDate = parseISO(date);

    if (isNaN(selectedDate.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    const dayOfWeek = selectedDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Get availability rules for that day
    const availabilityRules = await this.prisma.availabilityRule.findMany({
      where: {
        personal_id,
        daysOfWeek: {
          has: dayOfWeek,
        },
      },
    });

    if (availabilityRules.length === 0) {
      return []; // No availability on this day
    }

    // Generate time slots
    const timeSlots = [];

    for (const rule of availabilityRules) {
      const { startTime, endTime } = rule;

      // Convert startTime and endTime to Date objects on the selected date
      const startDateTime = parseISO(`${date}T${startTime}`);
      const endDateTime = parseISO(`${date}T${endTime}`);

      // Generate hourly slots
      let currentTime = startDateTime;

      while (isBefore(currentTime, endDateTime)) {
        const nextHour = addHours(currentTime, 1);

        // Check if slot is within endDateTime
        if (isBefore(nextHour, endDateTime) || currentTime.getTime() === endDateTime.getTime()) {
          timeSlots.push({
            start: currentTime.toISOString(),
            end: nextHour.toISOString(),
          });
        }

        currentTime = nextHour;
      }
    }

    // Get existing bookings on that date
    const startOfDay = parseISO(`${date}T00:00:00`);
    const endOfDay = parseISO(`${date}T23:59:59`);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        personal_id,
        startDatetime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'booked',
      },
    });

    // Exclude booked slots
    const availableSlots = timeSlots.filter((slot) => {
      const slotStart = parseISO(slot.start);

      const isBooked = existingBookings.some((booking) => {
        const bookingStart = booking.startDatetime;
        return bookingStart.getTime() === slotStart.getTime();
      });

      return !isBooked;
    });

    return availableSlots;
  }

  // Create a booking
  async createBooking(createBookingDto: CreateBookingDto) {
    const { personal_id, trainee_id, startDatetime } = createBookingDto;

    // Ensure startDatetime is on the hour
    const startTime = parseISO(startDatetime);

    if (startTime.getMinutes() !== 0 || startTime.getSeconds() !== 0) {
      throw new BadRequestException('Start time must be on the hour.');
    }

    const endTime = addHours(startTime, 1);

    // Transaction to ensure atomicity
    const booking = await this.prisma.$transaction(async (prisma) => {
      // Validate personal_id
      const personal = await prisma.personal.findUnique({
        where: { id: personal_id },
      });

      if (!personal) {
        throw new BadRequestException('Invalid personal ID.');
      }

      // Validate trainee_id
      const trainee = await prisma.trainee.findUnique({
        where: { id: trainee_id },
      });

      if (!trainee) {
        throw new BadRequestException('Invalid trainee ID.');
      }

      // Check if the time slot is available
      const existingBooking = await prisma.booking.findFirst({
        where: {
          personal_id,
          startDatetime: startTime,
          status: 'booked',
        },
      });

      if (existingBooking) {
        throw new BadRequestException('Time slot is already booked.');
      }

      // Create the booking
      const newBooking = await prisma.booking.create({
        data: {
          personal_id,
          trainee_id,
          startDatetime: startTime,
          endDatetime: endTime,
          status: 'booked',
        },
      });

      //Notification for new schedule
      await this.notificationService.newScheduling({
        personal_id,
        startTime: format(startTime, 'HH:mm:ss'),
        endTime: format(endTime, 'HH:mm:ss'),
        trainee_id,
        schedule_id: newBooking.id,
      });

      return newBooking;
    });

    return booking;
  }


  // Get bookings for a professional
  async getBookings(personal_id: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        personal_id,
        status: 'booked',
      },
      include: {
        trainee: true,
      },
      orderBy: {
        startDatetime: 'asc',
      },
    });

    return bookings;
  }

  // Delete a booking
  async deleteBooking(booking_id: string, requested_by: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: booking_id },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found.');
    }

    if (booking.status !== 'booked') {
      throw new BadRequestException('Booking is not confirmed.');
    }

    await this.prisma.booking.delete({
      where: { id: booking_id },
    });

    //Notify deletion
    await this.notificationService.cancelScheduling({
      trainee_id: booking.trainee_id,
      personal_id: booking.personal_id,
      schedule_id: booking_id,
      type: requested_by,
    });

    return booking;
  }

  async getTraineeSchedule(trainee_id: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        trainee_id,
        status: 'booked',
      },
      include: {
        personal: true,
      },
      orderBy: {
        startDatetime: 'asc',
      },
    });
    const ids = bookings.map((booking) => booking.personal_id);
    const professionals = await this.prisma.page.findMany({
      where: {
        personal_id: {
          in: ids,
        },
      },
    });

    const schedule = bookings.map((booking) => {
      const professional = professionals.find(
        (prof) => prof.personal_id === booking.personal_id,
      );
      return {
        booking,
        professional,
      };
    });

    return schedule;
  }
}

