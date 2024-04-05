export class CreateLocationDto {
    state: string;
    city: "all" | "some";
    cities: string;
    admin_id: string;
}
