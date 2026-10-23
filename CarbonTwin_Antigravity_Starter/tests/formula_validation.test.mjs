// Unit tests for CarbonTwin simulation formulas and data integrity
import assert from 'node:assert';

function trapezoidalIntegration(prevKw, currKw, dtHours) {
  return ((prevKw + currKw) / 2) * dtHours;
}

function calculateCarbon(kwh, factor = 0.82) {
  return kwh * factor;
}

function calculateSolar(capacityKw, irradiance, pr = 0.8) {
  const norm = Math.max(0, Math.min(1.0, irradiance / 1000));
  return capacityKw * norm * pr;
}

function getTariffRate(hour) {
  if (hour < 6 || hour >= 22) return 6.5; // Off-Peak
  if ((hour >= 9 && hour < 12) || (hour >= 18 && hour < 22)) return 11.2; // Peak
  return 8.5; // Normal
}

console.log('--- RUNNING CARBONTWIN FORMULA VALIDATION TESTS ---');

// Test 1: Constant power trapezoidal integration
{
  const energy = trapezoidalIntegration(100, 100, 1.0);
  assert.strictEqual(energy, 100, 'Constant 100 kW over 1h should yield exactly 100 kWh');
  console.log('✓ Test 1 Passed: Constant power trapezoidal integration (100 kW * 1h = 100 kWh)');
}

// Test 2: Linear ramp power trapezoidal integration
{
  const energy = trapezoidalIntegration(50, 150, 2.0);
  assert.strictEqual(energy, 200, 'Ramping 50 kW to 150 kW over 2h should yield 200 kWh');
  console.log('✓ Test 2 Passed: Varying ramp trapezoidal integration (((50+150)/2)*2 = 200 kWh)');
}

// Test 3: Carbon emission calculation
{
  const carbon = calculateCarbon(100, 0.82);
  assert.strictEqual(carbon, 82, '100 kWh with 0.82 kg/kWh should yield 82 kg CO2e');
  console.log('✓ Test 3 Passed: Carbon emission calculation (100 kWh * 0.82 = 82 kg CO2e)');
}

// Test 4: Solar generation clamp and nighttime zero
{
  const nightSolar = calculateSolar(50, 0);
  assert.strictEqual(nightSolar, 0, 'Nighttime irradiance 0 W/m² must produce 0 kW');
  const peakSolar = calculateSolar(50, 1000, 0.8);
  assert.strictEqual(peakSolar, 40, 'Peak noon irradiance 1000 W/m² must produce 40 kW');
  console.log('✓ Test 4 Passed: Solar PV model (Night = 0 kW, Noon Peak = 40 kW)');
}

// Test 5: MSEDCL TOD tariff windows
{
  assert.strictEqual(getTariffRate(3), 6.5, '03:00 must be off-peak ₹6.50');
  assert.strictEqual(getTariffRate(10), 11.2, '10:00 must be peak ₹11.20');
  assert.strictEqual(getTariffRate(14), 8.5, '14:00 must be normal ₹8.50');
  assert.strictEqual(getTariffRate(20), 11.2, '20:00 must be peak ₹11.20');
  assert.strictEqual(getTariffRate(23), 6.5, '23:00 must be off-peak ₹6.50');
  console.log('✓ Test 5 Passed: MSEDCL TOD Tariff schedule verification');
}

console.log('--- ALL 5 FORMULA VALIDATION TESTS PASSED SUCCESSFULLY ---');
