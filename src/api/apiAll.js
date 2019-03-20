import request from '@/utils/request';

const ammeter = {
  get(url, params) {
    return request({
      url,
      methods: 'get',
      params,
    });
  },
};

export default ammeter;
