let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Change based on your device's service UUID
    });

    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
    bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'); // RX characteristic

    document.getElementById('connectStatus').textContent = "CONNECTED";
  } catch (error) {
    console.error("Connection failed", error);
    document.getElementById('connectStatus').textContent = "CONNECTION FAILED";
  }
}

async function sendCommand(command) {
  if (!bluetoothCharacteristic) {
    alert("Please connect to a Bluetooth device first.");
    return;
  }

  const encoder = new TextEncoder();
  await bluetoothCharacteristic.writeValue(encoder.encode(command));

  document.getElementById('motorStatus').textContent = command;
}