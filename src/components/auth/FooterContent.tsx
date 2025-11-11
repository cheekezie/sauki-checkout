import { Link } from "react-router-dom";

export const VerificationFooter = () => (
  <div className="text-center text-sm text-muted-foreground mt-6">
    Started but did not complete verification?{" "}
    <Link
      to="/verification"
      className="text-primary hover:text-primary/80 cursor-pointer"
    >
      Click here
    </Link>
  </div>
);

export const RememberPinFooter = () => (
  <div className="text-center text-sm text-muted-foreground mt-6">
    Remember your PIN?{" "}
    <Link
      to="/login"
      className="text-primary hover:text-primary/80 cursor-pointer"
    >
      Sign in
    </Link>
  </div>
);

export const SupportFooter = () => (
  <div className="text-center text-sm text-muted-foreground mt-6">
    Need help? Contact our support team at{" "}
    <a
      href="mailto:support@fees.ng"
      className="text-primary hover:text-primary/80 cursor-pointer"
    >
      support@fees.ng
    </a>
  </div>
);
