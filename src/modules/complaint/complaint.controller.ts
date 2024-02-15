import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Complaint")
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.create(createComplaintDto);
  }

  @Get()
  getComplaints() {
    return this.complaintService.getAllComplaints();
  }

  @Get(':id')
  getComplaintById(@Param('id') id: string) {
    return this.complaintService.getComplaintById(id);
  }

  @Post('/email')
  GetComplaintByEmail(@Body() user) {
    return this.complaintService.getComplaintByEmail(user.email);
  }

  @Delete(':id')
  deleteComplaint(@Param('id') id: string) {
    return this.complaintService.deleteComplaint(id);
  }

  @Delete('/user')
  deleteComplaintsByEmail(@Body() user) {
    return this.complaintService.deleteComplaintsByEmail(user.email);
  }
}
