export type ErrorResponse =
  | {
      status: "invalidData";
      issues: { path: string; message: string }[];
    }
  | {
      status: "error";
    };
