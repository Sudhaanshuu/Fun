/**
 * Educational Telecom Simulation Engine
 * Requirement 10: Strict SimulationProvider generating synthetic carrier states without dialing.
 */

export interface SimulationEvent {
  timestamp: string;
  state: string;
  message: string;
  carrier_latency_ms: number;
}

export interface SimulationParams {
  jobId: string;
  targetMasked: string;
  count: number;
}

export class SimulationProvider {
  /**
   * Generates synthetic Voice Call state progression
   * States: CALL_CREATED -> CALL_RINGING -> CALL_CONNECTED -> CALL_COMPLETED
   */
  static simulateCall(params: SimulationParams): SimulationEvent[] {
    const now = Date.now();
    return [
      {
        timestamp: new Date(now).toISOString(),
        state: 'CALL_CREATED',
        message: `Synthetic SIP session initiated for identifier ${params.targetMasked}`,
        carrier_latency_ms: 12,
      },
      {
        timestamp: new Date(now + 800).toISOString(),
        state: 'CALL_RINGING',
        message: 'SIMULATION — Simulated SIP 180 Ringing. No real network dialed.',
        carrier_latency_ms: 45,
      },
      {
        timestamp: new Date(now + 2000).toISOString(),
        state: 'CALL_CONNECTED',
        message: 'SIMULATION — Synthetic 200 OK connected state established.',
        carrier_latency_ms: 32,
      },
      {
        timestamp: new Date(now + 3500).toISOString(),
        state: 'CALL_COMPLETED',
        message: `SIMULATION — Call session completed (${params.count} mock cycles). Zero carrier charges.`,
        carrier_latency_ms: 14,
      },
    ];
  }

  /**
   * Generates synthetic SMS state progression
   * States: SMS_CREATED -> SMS_QUEUED -> SMS_DELIVERED
   */
  static simulateSMS(params: SimulationParams): SimulationEvent[] {
    const now = Date.now();
    return [
      {
        timestamp: new Date(now).toISOString(),
        state: 'SMS_CREATED',
        message: `Synthetic SMPP packet accepted for target ${params.targetMasked}`,
        carrier_latency_ms: 10,
      },
      {
        timestamp: new Date(now + 600).toISOString(),
        state: 'SMS_QUEUED',
        message: 'SIMULATED SMS — Message queued in synthetic carrier gateway.',
        carrier_latency_ms: 22,
      },
      {
        timestamp: new Date(now + 1800).toISOString(),
        state: 'SMS_DELIVERED',
        message: `SIMULATED SMS — Delivery receipt (DLR) acknowledged for ${params.count} simulated messages.`,
        carrier_latency_ms: 18,
      },
    ];
  }

  /**
   * Generates combined Voice and SMS state progression
   */
  static simulateVoiceAndSMS(params: SimulationParams): SimulationEvent[] {
    const calls = this.simulateCall(params);
    const sms = this.simulateSMS(params);
    return [...calls, ...sms].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}
