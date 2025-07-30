import { updateLiveMetrics, liveMetrics } from '../data/mockDatabase.js';

let updateInterval;
let connectedClients = 0;

// Initialize real-time updates
export const initializeRealTimeUpdates = (io) => {
  console.log('🔴 Real-time service initialized');

  // Track connections
  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`📊 Client connected. Total clients: ${connectedClients}`);

    // Send current real-time data immediately
    socket.emit('initial-data', {
      metrics: liveMetrics,
      timestamp: new Date().toISOString()
    });

    // Also send real-time update immediately so charts start with current values
    socket.emit('real-time-update', {
      metrics: liveMetrics,
      activeUsers: liveMetrics.activeUsers,
      revenue: liveMetrics.totalRevenue,
      conversions: liveMetrics.conversions,
      timestamp: new Date().toISOString()
    });

    // Handle client subscription to specific data streams
    socket.on('subscribe', (dataType) => {
      socket.join(dataType);
      console.log(`📈 Client subscribed to ${dataType} updates`);

      // Send current data immediately for the subscribed stream
      switch (dataType) {
        case 'metrics':
          socket.emit('metrics-update', {
            data: liveMetrics,
            timestamp: new Date().toISOString(),
            updateType: 'subscription-initial'
          });
          // Also send real-time update format immediately
          socket.emit('real-time-update', {
            metrics: liveMetrics,
            activeUsers: liveMetrics.activeUsers,
            revenue: liveMetrics.totalRevenue,
            conversions: liveMetrics.conversions,
            timestamp: new Date().toISOString()
          });
          break;
        case 'campaigns':
          socket.emit('campaigns-update', { 
            message: 'Campaign data stream active',
            timestamp: new Date().toISOString()
          });
          break;
        case 'analytics':
          socket.emit('analytics-update', {
            message: 'Analytics data stream active',
            timestamp: new Date().toISOString()
          });
          break;
      }
    });

    // Handle unsubscription
    socket.on('unsubscribe', (dataType) => {
      socket.leave(dataType);
      console.log(`📉 Client unsubscribed from ${dataType} updates`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`📊 Client disconnected. Total clients: ${connectedClients}`);
    });
  });

  // Start real-time updates only when there are connected clients
  startRealTimeUpdates(io);
};

// Start the real-time update intervals
const startRealTimeUpdates = (io) => {
  // Update metrics every 3 seconds for smooth real-time feel
  updateInterval = setInterval(() => {
    if (connectedClients > 0) {
      const updatedMetrics = updateLiveMetrics();
      
      // Emit to all clients subscribed to metrics
      io.to('metrics').emit('metrics-update', {
        data: updatedMetrics,
        timestamp: new Date().toISOString(),
        updateType: 'live-metrics'
      });

      // Emit general real-time updates
      io.emit('real-time-update', {
        metrics: updatedMetrics,
        activeUsers: updatedMetrics.activeUsers,
        revenue: updatedMetrics.totalRevenue,
        conversions: updatedMetrics.conversions,
        timestamp: new Date().toISOString()
      });

      // Log every 20th update (every minute)
      if (Math.random() < 0.05) {
        console.log(`🔄 Real-time update sent to ${connectedClients} clients - Revenue: $${updatedMetrics.totalRevenue.toFixed(2)}`);
      }
    }
  }, 3000); // 3 second intervals for smooth updates without overwhelming

  // Simulate campaign updates every 2 minutes (much less frequent)
  setInterval(() => {
    if (connectedClients > 0) {
      const campaignUpdate = {
        type: 'campaign-metric-update',
        campaignId: 'summer-sale-2024',
        metrics: {
          impressions: Math.floor(Math.random() * 1000) + 50000,
          clicks: Math.floor(Math.random() * 100) + 2000,
          conversions: Math.floor(Math.random() * 10) + 50
        },
        timestamp: new Date().toISOString()
      };

      io.to('campaigns').emit('campaigns-update', campaignUpdate);
      // Very minimal logging
      if (Math.random() < 0.1) {
        console.log('📈 Campaign update sent to subscribed clients');
      }
    }
  }, 120000); // 2 minute intervals

  // Simulate alerts/notifications every 2 minutes
  setInterval(() => {
    if (connectedClients > 0) {
      const alerts = generateRandomAlerts();
      
      if (alerts.length > 0) {
        io.emit('alerts-update', {
          alerts,
          timestamp: new Date().toISOString()
        });
        console.log(`🚨 ${alerts.length} alerts sent to clients`);
      }
    }
  }, 120000); // 2 minute intervals

  console.log('⏰ Real-time update intervals started');
};

// Generate random alerts for demo purposes
const generateRandomAlerts = () => {
  const alerts = [];
  const alertTypes = [
    {
      type: 'performance',
      severity: 'info',
      message: 'Campaign "Summer Sale 2024" is performing 15% above target',
      icon: '📈'
    },
    {
      type: 'budget',
      severity: 'warning',
      message: 'Campaign "Brand Awareness Q3" has reached 80% of budget',
      icon: '💰'
    },
    {
      type: 'conversion',
      severity: 'success',
      message: 'Conversion rate increased by 2.3% in the last hour',
      icon: '🎯'
    },
    {
      type: 'traffic',
      severity: 'info',
      message: 'Unusual traffic spike detected from mobile devices',
      icon: '📱'
    },
    {
      type: 'goal',
      severity: 'success',
      message: 'Monthly revenue goal achieved 5 days early!',
      icon: '🏆'
    }
  ];

  // Randomly generate 0-2 alerts
  const numAlerts = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numAlerts; i++) {
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      ...randomAlert,
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  return alerts;
};

// Stop real-time updates (cleanup function)
export const stopRealTimeUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('⏹️ Real-time updates stopped');
  }
};

// Get current connection status
export const getConnectionStatus = () => {
  return {
    connectedClients,
    updateInterval: updateInterval ? 'active' : 'inactive',
    lastUpdate: new Date().toISOString()
  };
};

// Manual trigger for testing
export const triggerManualUpdate = (io, data) => {
  if (connectedClients > 0) {
    io.emit('manual-update', {
      ...data,
      timestamp: new Date().toISOString(),
      type: 'manual-trigger'
    });
    console.log('🔧 Manual update triggered');
    return true;
  }
  return false;
}; 