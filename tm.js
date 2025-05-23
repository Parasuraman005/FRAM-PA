let bluetoothDevice;
let bluetoothCharacteristic;

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Change to match your device service
    });

    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
    bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'); // RX

    await bluetoothCharacteristic.startNotifications();
    bluetoothCharacteristic.addEventListener('characteristicvaluechanged', handleData);

    document.getElementById('connectStatus').textContent = "CONNECTED";
  } catch (error) {
    console.error("Connection failed", error);
    document.getElementById('connectStatus').textContent = "CONNECTION FAILED";
  }
}

function handleData(event) {
  const value = new TextDecoder().decode(event.target.value);

  // Expected format: TEMP:25.6;MOIS:78
  const tempMatch = value.match(/TEMP:([0-9.]+)/);
  const moistMatch = value.match(/MOIS:([0-9.]+)/);

  if (tempMatch) {
    document.getElementById('tempValue').textContent = tempMatch[1];
  }

  if (moistMatch) {
    document.getElementById('moistureValue').textContent = moistMatch[1];
  }
}