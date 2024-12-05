import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thêm các cấu hình khác của bạn ở đây
};

export default withNextIntl(nextConfig); 