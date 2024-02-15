export interface INote {
    body: string;
    order_id: "admin" | string;
    product_id: "admin" | string;
    status: "unread" | "read";
  }
  