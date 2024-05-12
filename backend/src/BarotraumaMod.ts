import ModStatus from "./ModStatus";

export interface BarotraumaMod {
    id: string;
    name: string;
    path: string;
    status: ModStatus;
}

export default BarotraumaMod