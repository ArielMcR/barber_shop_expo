import React from "react";
import { View, Text, Button } from "react-native";
import { Appointment } from "../../types/typesApontamento";

interface AppointmentItemProps {
    time: string;
    isAgendado: boolean;
    agendamento: Appointment;
    onBook: () => void;
    onEdit: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    onReactivate: () => void;
}

export default function AppointmentItem({
    time,
    isAgendado,
    agendamento,
    onBook,
    onEdit,
    onConfirm,
    onCancel,
    onReactivate,
}: AppointmentItemProps) {

    if (!isAgendado) {
        return (
            <Button title={`Agendar - ${time}`} onPress={onBook} color="#4CAF50" />
        );
    }

    return (
        <View className="border border-gray-300 p-2 rounded-md">
            <Text className="text-base">{time} - {agendamento.client.nome}</Text>
            <Text className="text-sm text-gray-500">{agendamento.tipoServico.nome}</Text>
            <Text className="text-sm text-gray-500">Status: {agendamento.status}</Text>
            <View className="flex-row gap-2 mt-2">
                <Button title="Editar" onPress={onEdit} color="#2196F3" />
                <Button title="Confirmar" onPress={onConfirm} color="#4CAF50" disabled={agendamento.status === "Confirmado"} />
                <Button title="Cancelar" onPress={onCancel} color="#F44336" disabled={agendamento.status === "Cancelado"} />
                <Button title="Reativar" onPress={onReactivate} color="#9C27B0" disabled={agendamento.status !== "Cancelado"} />
            </View>
        </View>
    );
}