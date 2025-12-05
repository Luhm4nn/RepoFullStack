// Test script to verify all dashboard endpoints
const testEndpoints = async () => {
    const baseURL = 'http://localhost:4000';

    console.log('Testing dashboard endpoints...\n');

    // Test 1: Películas en cartelera
    try {
        const res1 = await fetch(`${baseURL}/Peliculas/cartelera`);
        const data1 = await res1.json();
        console.log(`✅ /Peliculas/cartelera: ${data1.length} películas`);
    } catch (error) {
        console.log(`❌ /Peliculas/cartelera: ${error.message}`);
    }

    // Test 2: Salas
    try {
        const res2 = await fetch(`${baseURL}/Salas`);
        const data2 = await res2.json();
        console.log(`✅ /Salas: ${data2.length} salas`);
    } catch (error) {
        console.log(`❌ /Salas: ${error.message}`);
    }

    // Test 3: Funciones públicas
    try {
        const res3 = await fetch(`${baseURL}/Funciones/publicas`);
        const data3 = await res3.json();
        console.log(`✅ /Funciones/publicas: ${data3.length} funciones`);
    } catch (error) {
        console.log(`❌ /Funciones/publicas: ${error.message}`);
    }

    // Test 4: Latest reservas
    try {
        const res4 = await fetch(`${baseURL}/Reservas/latest?limit=4`);
        const data4 = await res4.json();
        console.log(`✅ /Reservas/latest: ${data4.length} reservas`);
    } catch (error) {
        console.log(`❌ /Reservas/latest: ${error.message}`);
    }
};

testEndpoints();
