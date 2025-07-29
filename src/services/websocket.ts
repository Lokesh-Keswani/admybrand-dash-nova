import { io, Socket } from 'socket.io-client';

// WebSocket configuration
const WEBSOCKET_URL = 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 3000;
  private subscribers: Map<string, Array<(data: any) => void>> = new Map();

  constructor() {
    // Auto-connect when service is created to maintain persistent connection
    setTimeout(() => {
      this.connect();
    }, 500); // Faster initial connection
  }

  // Connect to WebSocket server
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    console.log('🔌 Connecting to WebSocket server...');
    
    // Reset reconnect attempts when manually connecting
    this.reconnectAttempts = 0;
    
    this.socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      upgrade: true,
      rememberUpgrade: true,
      forceNew: false,
      reconnection: true, // Enable automatic reconnection
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    this.setupEventListeners();
  }

  // Set up event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Emit connection success to subscribers
      this.emit('connection', { status: 'connected', timestamp: new Date().toISOString() });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.emit('connection', { status: 'disconnected', reason, timestamp: new Date().toISOString() });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('✅ WebSocket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'reconnected', attemptNumber, timestamp: new Date().toISOString() });
    });

    this.socket.on('reconnecting', (attemptNumber) => {
      console.log('🔄 WebSocket reconnecting... attempt', attemptNumber);
      this.emit('connection', { status: 'reconnecting', attemptNumber, timestamp: new Date().toISOString() });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('🚫 WebSocket reconnection error:', error);
      this.emit('connection', { status: 'reconnect_error', error: error.message, timestamp: new Date().toISOString() });
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed after all attempts');
      this.emit('connection', { status: 'reconnect_failed', timestamp: new Date().toISOString() });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      this.emit('connection', { status: 'error', error: error.message, timestamp: new Date().toISOString() });
    });

    // Real-time data events
    this.socket.on('initial-data', (data) => {
      console.log('📊 Received initial data');
      this.emit('initial-data', data);
    });

    this.socket.on('real-time-update', (data) => {
      console.log('🔄 Real-time update received');
      this.emit('real-time-update', data);
    });

    this.socket.on('metrics-update', (data) => {
      console.log('📈 Metrics update received');
      this.emit('metrics-update', data);
    });

    this.socket.on('campaigns-update', (data) => {
      console.log('🎯 Campaign update received');
      this.emit('campaigns-update', data);
    });

    this.socket.on('analytics-update', (data) => {
      console.log('📊 Analytics update received');
      this.emit('analytics-update', data);
    });

    this.socket.on('alerts-update', (data) => {
      console.log('🚨 Alerts update received');
      this.emit('alerts-update', data);
    });

    this.socket.on('manual-update', (data) => {
      console.log('🔧 Manual update received');
      this.emit('manual-update', data);
    });
  }

  // Handle reconnection logic
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  // Subscribe to real-time updates
  subscribe(dataType: 'metrics' | 'campaigns' | 'analytics'): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ Cannot subscribe - WebSocket not connected');
      return;
    }

    console.log(`📡 Subscribing to ${dataType} updates`);
    this.socket.emit('subscribe', dataType);
  }

  // Unsubscribe from real-time updates
  unsubscribe(dataType: 'metrics' | 'campaigns' | 'analytics'): void {
    if (!this.socket?.connected) {
      return;
    }

    console.log(`📡 Unsubscribing from ${dataType} updates`);
    this.socket.emit('unsubscribe', dataType);
  }

  // Generic event listener
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    
    this.subscribers.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit event to subscribers
  private emit(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event callback:', error);
        }
      });
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get connection info
  getConnectionInfo(): any {
    return {
      connected: this.isConnected(),
      id: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
      subscriberCount: Array.from(this.subscribers.values())
        .reduce((total, callbacks) => total + callbacks.length, 0)
    };
  }

  // Force reconnection
  forceReconnect(): void {
    console.log('🔄 Forcing WebSocket reconnection...');
    if (this.socket) {
      this.socket.disconnect();
    }
    // Reset and reconnect
    this.reconnectAttempts = 0;
    setTimeout(() => {
      this.connect();
    }, 500);
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Manual trigger (for testing)
  triggerManualUpdate(data: any): void {
    if (this.socket?.connected) {
      this.socket.emit('manual-trigger', data);
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// React hook for using WebSocket
export const useWebSocket = () => {
  return {
    service: webSocketService,
    isConnected: webSocketService.isConnected(),
    subscribe: webSocketService.subscribe.bind(webSocketService),
    unsubscribe: webSocketService.unsubscribe.bind(webSocketService),
    on: webSocketService.on.bind(webSocketService),
    getConnectionInfo: webSocketService.getConnectionInfo.bind(webSocketService),
  };
}; 