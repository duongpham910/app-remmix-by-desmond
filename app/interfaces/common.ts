export interface ActionDataProps {
  errors?: {
    [key: string]: string | undefined;
  };
}

export interface onActionProps {
  onAction: () => void;
}

export interface orderDataProps {
  orderId?: string | undefined;
  orderNumber?: string | undefined;
  totalPrice?: string | undefined;
  paymentGateway?: string | undefined;
  customerEmail?: string | undefined;
  customerFullName?: string | undefined;
  customerAddress?: string | undefined;
  tags?: string | undefined;
}

export interface payloadProps {
  orderId: string;
  orderNumber: string;
  totalPrice: string;
  paymentGateway: string
  customerEmail: string;
  customerFullName: string;
  customerAddress: string
  tags: string;
}
