// components/INA-CBGs/Header.tsx
interface navbarProps {
    title: string;
    description: string;
  }
  
  export default function Navbar({ title, description }: navbarProps) {
    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <a href="/dashboard" className="hover:text-blue-500">Dashboard</a>
          <span>›</span>
          <a href="/inacbgs" className="hover:text-blue-500">INA-CBGs</a>
          <span>›</span>
          <span className="text-gray-900">{title}</span>
        </div>    
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    );
  }