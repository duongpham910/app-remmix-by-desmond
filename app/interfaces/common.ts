export interface ActionDataProps {
  errors?: {
    [key: string]: string | undefined;
  };
}

export interface onActionProps {
  onAction: () => void;
}

