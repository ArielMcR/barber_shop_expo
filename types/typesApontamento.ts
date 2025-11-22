import { Client } from "./typesCliente";
import { Service } from "./typesServico";

export interface Appointment {
    id?: number;
    client: Client;
    diaAgendamento: Date;
    horaAgendada: string;
    tipoServico: Service;
    status: string;
}