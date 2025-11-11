export interface Session {
  _id: string;
  year: string;
  term: 'firstTerm' | 'secondTerm' | 'thirdTerm';
  status: 'active' | 'inactive' | 'completed';
  organization?: string;
  createdAt?: string;
  updatedAt?: string;
  history?: any[];
  [key: string]: any;
}

export interface SessionListResponse {
  status: string;
  data: Session[];
}

