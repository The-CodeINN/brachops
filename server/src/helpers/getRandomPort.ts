const availablePorts: number[] = Array.from({ length: 2768 }, (_, i) => i + 30000);

export const getRandomPort = (): number => {
  if (availablePorts.length === 0) {
    throw new Error("No available ports left.");
  }
  const randomIndex = Math.floor(Math.random() * availablePorts.length);
  const port = availablePorts[randomIndex];
  availablePorts.splice(randomIndex, 1); // Remove the assigned port
  return port;
};
