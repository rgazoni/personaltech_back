import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  // Create an availability rule
  @Post('availability')
  async createAvailability(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    try {
      const availabilityRule = await this.scheduleService.createAvailabilityRule(
        createAvailabilityDto,
      );
      return availabilityRule;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get availability rules for a professional
  @Get('availability/:personal_id')
  async getAvailability(@Param('personal_id') personal_id: string) {
    try {
      const availabilityRules = await this.scheduleService.getAvailabilityRules(
        personal_id,
      );
      return availabilityRules;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get available hourly time slots for a professional on a specific date
  @Get('availability/slots')
  async getAvailableSlots(
    @Query('personal_id') personal_id: string,
    @Query('date') date: string, // date in 'YYYY-MM-DD' format
  ) {
    try {
      const availableSlots = await this.scheduleService.getAvailableSlots(
        personal_id,
        date,
      );
      return availableSlots;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Create a booking
  @Post('bookings')
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    try {
      const booking = await this.scheduleService.createBooking(createBookingDto);
      return booking;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get bookings for a professional
  @Get('bookings/:personal_id')
  async getBookings(@Param('personal_id') personal_id: string) {
    try {
      const bookings = await this.scheduleService.getBookings(personal_id);
      return bookings;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

