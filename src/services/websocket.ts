import { io, Socket } from 'socket.io-client';

// WebSocket configuration
const WEBSOCKET_URL = 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 2;
  private reconnectInterval = 10000;
  private subscribers: Map<string, Array<(data: any) => void>> = new Map();

  constructor() {
    // Auto-connect when service is created to maintain persistent connection
    setTimeout(() => {
      this.connect();
    }, 1000); // Small delay to allow backend to start
  }

  // Connect to WebSocket server
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    console.log('🔌 Connecting to WebSocket server...');
    
    this.socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: true,
      forceNew: false,
      reconnection: false, // We'll handle reconnection manually
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
      
      // Only auto-reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && reason !== 'transport close') {
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚫 WebSocket connection error:', error);
      this.emit('connection', { status: 'error', error: error.message, timestamp: new Date().toISOString() });
      
      this.handleReconnect();
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