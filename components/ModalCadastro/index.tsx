// components/BookingModal.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { Service } from "../../types/typesServico";
import { Client } from "../../types/typesCliente";

interface BookingModalProps {
    time: string;
    clients: Client[];
    services: Service[];
    initialClient?: string;
    initialService?: string;
    onConfirm: (clientName: string, serviceName: string) => void;
}

export default function BookingModal({
    time,
    clients,
    services,
    initialClient = "",
    initialService = "",
    onConfirm,
}: BookingModalProps) {
    const [clientName, setClientName] = useState(initialClient);
    const [serviceName, setServiceName] = useState(initialService);

    const handleConfirm = () => {
        if (clientName && serviceName) {
            onConfirm(clientName, serviceName);
        }
    };

    return (
        <View className={"flex-1 justify-center items-center bg-black bg-opacity-50"}>
            <View className={"bg-white p-4 rounded-lg w-80"}>
                <Text className={"text-lg font-bold mb-2"}>Agendar - {time}</Text>
                <TextInput
                    className={"border border-gray-300 rounded-md p-2 mb-2 w-full"}
                    placeholder="Nome do Cliente"
                    value={clientName}
                    onChangeText={setClientName}
                />
                <ScrollView className={"max-h-40 mb-2"}>
                    {clients.map((client) => (
                        <Text
                            key={client.id || client.nome}
                            className={"p-1"}
                            onPress={() => setClientName(`${client.nome} ${client.sobrenome}`.trim())}
                        >
                            {client.nome} {client.sobrenome}
                        </Text>
                    ))}
                </ScrollView>
                <TextInput
                    className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                    placeholder="Nome do Serviço"
                    value={serviceName}
                    onChangeText={setServiceName}
                />
                <ScrollView className={"max-h-40 mb-2"}>
                    {services.map((service) => (
                        <Text
                            key={service.id_servico || service.nome}
                            className={"p-1"}
                            onPress={() => setServiceName(service.nome)}
                        >
                            {service.nome}
                        </Text>
                    ))}
                </ScrollView>
                <Button title="Confirmar" onPress={handleConfirm} />
            </View>
        </View>
    );
}