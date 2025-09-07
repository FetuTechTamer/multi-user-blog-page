import MainNewsletter from "./main-newsletter";

const MainFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-900/10">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Newsletter */}
        <MainNewsletter />

        {/* Horizontal line */}
        <hr className="my-8 border-gray-200" />

        {/* Copyright */}
        <p className="text-center text-sm text-gray-500">
          © 2025 Multi-User Blogging App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default MainFooter;
