import { Length, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { CreateProductDto } from "./createProduct.dto";
import { ApiProperty } from "@nestjs/swagger";
export class UpdateProductDto extends CreateProductDto{}