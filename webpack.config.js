const path = require('path');

module.exports = {
  entry: './src/index.js', // entry point của bạn
  output: {
    filename: 'bundle.js', // Tên file đầu ra
    path: path.resolve(__dirname, 'dist'), // Đường dẫn file đầu ra
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,  // Quy tắc xử lý tất cả file .js và .jsx
        exclude: /node_modules/,  // Không xử lý các file trong thư mục node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Các preset để chuyển JSX và ES6
          },
        },
      },
      {
        test: /\.css$/i, // Quy tắc xử lý file CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Thêm hỗ trợ cho .jsx
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Cấu hình thư mục chứa file tĩnh
    },
    port: 5000, // Cổng mà Webpack Dev Server sẽ chạy
    open: true, // Mở trình duyệt tự động
    hot: true,  // Sử dụng Hot Module Replacement
  },
};
