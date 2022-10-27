export default {
  search: {
    placeholder: 'Tìm kiếm ...',
  },
  sort: {
    sortAsc: 'Sắp xếp tăng dần',
    sortDesc: 'Sắp xếp giảm dần',
  },
  pagination: {
    previous: 'Trước',
    next: 'Sau',
    navigate: (page, pages) => `Trang ${page} tổng ${pages}`,
    page: (page) => `Trang ${page}`,
    showing: 'Kết quả',
    of: '/',
    to: '-',
    results: 'dòng',
  },
  loading: 'Đang tải...',
  noRecordsFound: 'Không có dữ liệu được tìm thấy',
  error: 'Có lỗi xảy ra trong quá trình gửi yêu cầu',
};
