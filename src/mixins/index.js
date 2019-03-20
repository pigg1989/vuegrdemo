import api from '@/api/apiAll';

export default {
  name: 'mixins', 
  data() {
    return {
      deviceNumber: '',
      today: '',
      timeline: '00:00:00',
    };
  },
  created() {
    this.getDeviceNumber();
  },
  methods: {
    getDeviceNumber() {
      api.get('/inventory/managedObjects', {
        query: '$filter=(type eq \'c8y_meter\')',
        withTotalPages: true,
        pageSize: 1,
      }).then((res) => {
       
        this.deviceNumber = res.data.statistics.totalPages;
      });
    },
  },
};
  
