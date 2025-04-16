# NameFrame Certificate Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/travis/nameframe/nameframe.svg)](https://travis-ci.org/nameframe/nameframe)
[![GitHub issues](https://img.shields.io/github/issues/nameframe/nameframe.svg)](https://github.com/nameframe/nameframe/issues)

A dynamic certificate generator that empowers event organizers to create and distribute personalized certificates effortlessly. Built with **Next.js**, **React**, and the **HTML5 Canvas API**, NameFrame offers real-time certificate previews, name validation, adjustable font sizes, and one-click downloads with celebratory confetti animations.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Certificate Template Specifications](#certificate-template-specifications)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **Real-Time Certificate Preview:**  
  Instantly render certificates using the HTML5 Canvas with dynamic text overlays.

- **Name Validation:**  
  Validates entered names against a predefined participant list to ensure authenticity.

- **Adjustable Font Size:**  
  Customize font size via the UI for perfect text placement on the certificate.

- **Download with Confetti Celebration:**  
  Download certificates as PNG files with a delightful confetti animation.

- **Responsive & Elegant UI:**  
  Modern design featuring glassmorphism effects and smooth animations for a premium experience.

- **Robust Mailing Architecture:**  
  *(For Production)* Backend integration for emailing certificates, with rate limiting, sender rotation, and Kafka queues for scalability.

## Demo

Check out NameFrame in action:

![Certificate Preview](./screenshots/preview.png)  
*Real-time certificate rendering with dynamic text overlay.*

![Mailing Dashboard](./screenshots/mailing_dashboard.png)  
*Mailing dashboard for bulk certificate distribution.*

> *Live demo coming soon! Visit [nameframe.app](#) for a preview (link placeholder).*

## Certificate Template Specifications

- **Recommended Dimensions:**  
  1920 x 1080 pixels (16:9 aspect ratio) for optimal text overlay resolution.

- **Text Placement Guidance:**  
  Recipient names are rendered near the center, at approximately 60% of the template height (horizontally centered). Adjust placement directly in the UI.

- **Accepted Image Formats:**  
  PNG or JPEG.

## Installation & Setup

### Prerequisites

- **Node.js** (>= 14.x)
- **npm** or **yarn**
- A **Cloudinary** account for image uploads (optional for production)

### Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/nameframe/nameframe.git
   cd nameframe
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   Or, if using Yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables:**  
   Create a `.env.local` file in the project root and add the following:

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

   Replace `your_cloudinary_cloud_name` and `your_upload_preset` with your Cloudinary credentials. Obtain these from your [Cloudinary dashboard](https://cloudinary.com/).

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   Or with Yarn:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

5. **Build for Production (Optional):**

   ```bash
   npm run build
   npm run start
   ```

## Usage

1. **Upload a Certificate Template:**  
   Upload a PNG or JPEG template via the UI (1920x1080 recommended).

2. **Enter Participant Names:**  
   Input names manually or upload a participant list for validation.

3. **Customize Text:**  
   Adjust font size and placement using the preview controls.

4. **Generate & Download:**  
   Preview the certificate, then download it as a PNG with a confetti celebration.

5. **Bulk Mailing (Production):**  
   Configure the mailing system to send certificates to participants via email.

For detailed usage instructions, check the [docs](./docs) folder (coming soon).

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with descriptive messages:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. Push your branch and submit a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Reference any related issues in your pull request description.

For questions or suggestions, open an issue on [GitHub](https://github.com/nameframe/nameframe/issues).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/).
- Powered by [Cloudinary](https://cloudinary.com/) for image management.
- Inspired by modern certificate automation platforms and contemporary UI/UX design trends.