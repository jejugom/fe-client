interface Register {
  bookingCode: string;
  branchName: string;
  prodName: string;
  date: string;
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

export type { Register };
