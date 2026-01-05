import csrOverviewController from '../controllers/csrOverviewController.js';

export const setupCSROverviewSocket = (io, socket, user) => {
  console.log(`🔗 Setting up CSR Overview socket for user ${user._id}`);

  // Join CSR overview room and user's personal room
  const organizationId = user.orgId ? user.orgId.toString() : user._id.toString();
  socket.join('csr-overview');
  socket.join(organizationId.toString());
  socket.join(user._id.toString());
  
  // Handle real-time data requests
  socket.on('request-csr-overview-data', async (data) => {
    try {
      console.log('📊 CSR Overview data requested:', data);
      
      // Create a mock request object with user info
      const mockReq = {
        user: user,
        query: {
          period: data?.period || 'month',
          region: data?.region || 'all'
        },
        app: {
          get: (key) => {
            if (key === 'io') return io;
            return null;
          }
        }
      };

      // Create a mock response object
      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
        status: (code) => ({
          json: (data) => {
            responseData = data;
          }
        })
      };

      // Fetch real overview data
      try {
        await csrOverviewController.getOverviewData(mockReq, mockRes);

        if (responseData && responseData.success) {
          socket.emit('csr-overview-update', {
            type: 'overview-update',
            timestamp: new Date(),
            data: responseData.data
          });
        } else {
          // Emit error when response indicates failure
          socket.emit('error', { 
            message: responseData?.message || 'Failed to fetch CSR overview data',
            error: responseData?.error || 'Unknown error'
          });
        }
      } catch (controllerError) {
        console.error('Error fetching overview data:', controllerError);
        // Emit error to client
        socket.emit('error', { message: 'Failed to fetch CSR overview data' });
      }
    } catch (error) {
      console.error('Error handling CSR overview data request:', error);
      socket.emit('error', { message: 'Failed to fetch CSR overview data' });
    }
  });

  // Handle impact data updates
  socket.on('request-impact-update', async (data) => {
    try {
      const mockReq = {
        user: user,
        query: {
          period: data?.period || 'month',
          region: data?.region || 'all'
        },
        app: {
          get: (key) => {
            if (key === 'io') return io;
            return null;
          }
        }
      };

      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
        status: (code) => ({
          json: (data) => {
            responseData = data;
          }
        })
      };

      // Fetch real impact data
      try {
        await csrOverviewController.getOverviewData(mockReq, mockRes);
        
        if (responseData && responseData.success && responseData.data.impactData) {
          socket.emit('impact-update', {
            type: 'impact-update',
            timestamp: new Date(),
            data: responseData.data.impactData
          });
        } else {
          // Emit error when response indicates failure
          socket.emit('error', { 
            message: responseData?.message || 'Failed to fetch impact data',
            error: responseData?.error || 'Unknown error'
          });
        }
      } catch (controllerError) {
        console.error('Error fetching impact data:', controllerError);
        socket.emit('error', { message: 'Failed to fetch impact data' });
      }
    } catch (error) {
      console.error('Error handling impact update request:', error);
      socket.emit('error', { message: 'Failed to fetch impact data' });
    }
  });

  // Handle activity updates
  socket.on('request-activity-update', async (data) => {
    try {
      const activities = [
        { action: 'New campaign launched', location: 'Mumbai High School', time: '2 hours ago', color: 'green' },
        { action: 'Budget approved', location: 'Delhi Public School', time: '4 hours ago', color: 'blue' },
        { action: 'Report generated', location: 'Bangalore International', time: '6 hours ago', color: 'purple' },
        { action: 'Pilot completed', location: 'Chennai Central School', time: '1 day ago', color: 'orange' },
        { action: 'New school onboarded', location: 'Pune Public School', time: '2 days ago', color: 'green' }
      ];
      
      const activityData = {
        type: 'activity-update',
        timestamp: new Date(),
        data: activities.slice(0, Math.floor(Math.random() * 3) + 2)
      };
      
      socket.emit('activity-update', activityData);
    } catch (error) {
      console.error('Error handling activity update request:', error);
      socket.emit('error', { message: 'Failed to fetch activity data' });
    }
  });

  // Handle module progress updates
  socket.on('request-module-progress', async (data) => {
    try {
      const mockReq = {
        user: user,
        query: {
          period: data?.period || 'month',
          region: data?.region || 'all'
        },
        app: {
          get: (key) => {
            if (key === 'io') return io;
            return null;
          }
        }
      };

      let responseData = null;
      const mockRes = {
        json: (data) => {
          responseData = data;
        },
        status: (code) => ({
          json: (data) => {
            responseData = data;
          }
        })
      };

      // Fetch real module progress data
      try {
        await csrOverviewController.getOverviewData(mockReq, mockRes);
        
        if (responseData && responseData.success && responseData.data.moduleProgress) {
          socket.emit('module-progress-update', {
            type: 'module-progress-update',
            timestamp: new Date(),
            data: responseData.data.moduleProgress
          });
        } else {
          // Emit error when response indicates failure
          socket.emit('error', { 
            message: responseData?.message || 'Failed to fetch module progress data',
            error: responseData?.error || 'Unknown error'
          });
        }
      } catch (controllerError) {
        console.error('Error fetching module progress data:', controllerError);
        socket.emit('error', { message: 'Failed to fetch module progress data' });
      }
    } catch (error) {
      console.error('Error handling module progress request:', error);
      socket.emit('error', { message: 'Failed to fetch module progress data' });
    }
  });

  // Broadcast updates to all CSR users
  const broadcastUpdate = (type, data) => {
    io.to('csr-overview').emit('csr-overview-broadcast', {
      type,
      data,
      timestamp: new Date()
    });
    
    // Also emit to organization room
    if (organizationId) {
      io.to(organizationId.toString()).emit('csr:overview:update');
    }
  };

  // Export broadcast function for use in controllers
  socket.broadcastUpdate = broadcastUpdate;

  // Send initial connection confirmation
  socket.emit('csr-overview-connected', {
    message: 'Connected to CSR Overview real-time updates',
    timestamp: new Date()
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 CSR Overview socket disconnected for user ${user._id}`);
  });
};

