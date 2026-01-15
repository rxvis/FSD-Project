import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowLeft, FileText, X } from 'lucide-react';

const AchievementUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate Upload
        console.log('Uploading', file);
        navigate('/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} className="mr-1" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Upload Achievement Proof</h1>
                <p className="text-slate-500 mb-8">Upload screenshots or certificates to verify your scores.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => !file && document.getElementById('file-upload').click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        {file ? (
                            <div className="flex flex-col items-center">
                                <FileText size={48} className="text-green-500 mb-2" />
                                <p className="font-medium text-slate-800">{file.name}</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <X size={14} /> Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <UploadCloud size={48} className="text-slate-400 mb-2" />
                                <p className="font-medium text-slate-600">Click or drag file to upload</p>
                                <p className="text-sm text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            placeholder="Describe this achievement..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!file}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={18} />
                        Submit for Verification
                    </button>
                </form>
            </div>
        </div>
    );
};
export default AchievementUpload;
