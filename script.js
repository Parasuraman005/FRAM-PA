let bluetoothDevice;
let gattServer;
let commandCharacteristic;

const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; 
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; 

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]
    });

    document.getElementById('status').innerText = 'Connecting to GATT server...';

    gattServer = await bluetoothDevice.gatt.connect();
    const service = await gattServer.getPrimaryService(SERVICE_UUID);
    commandCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    // Start listening for notifications
    await commandCharacteristic.startNotifications();
    commandCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);

    document.getElementById('status').innerText = 'Connected and ready!';
  } catch (error) {
    document.getElementById('status').innerText = 'Connection failed!';
    console.error(error);
  }
}

function handleNotifications(event) {
  const decoder = new TextDecoder('utf-8');
  const value = decoder.decode(event.target.value);
  console.log('Received:', value);
  document.getElementById('receivedData').innerText = 'Received: ' + value;
}

async function sendCommand(command) {
  if (!commandCharacteristic) {
    alert("Please connect Bluetooth first!");
    return;
  }

  const encoder = new TextEncoder();
  let value;

  switch (command) {
    case 'water': value = encoder.encode('WATER_ON'); break;
    case 'temp': value = encoder.encode('GET_TEMP'); break;
    case 'npk': value = encoder.encode('GET_NPK'); break;
    default: return;
  }

  try {
    await commandCharacteristic.writeValue(value);
    alert(`${command.toUpperCase()} command sent.`);
  } catch (error) {
    console.error("Write failed", error);
  }
}