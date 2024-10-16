import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PdfViewer.css'; // Import your custom CSS for further styling
import ENV from '../../../Front_ENV';
import Loader from "../Loader/Loader.jsx";

const PdfViewer = () => {
    const {url,pdfTitle} = useParams();
    const [title, setTitle] = useState(pdfTitle);
    const [pdfUrl, setPdfUrl] = useState(url);
    useEffect(() => {
        // Fetch the PDF URL from the backend
        const fetchPdf = async () => {
            try {
                const response = await fetch(`${ENV.Back_Origin}/${pdfURL}`, {
                    method: 'GET',
                    credentials: 'include', // If you need cookies/credentials
                });

                if (response.ok) {
                    setTimeout(async () => {
                        const pdfBlob = await response.blob();
                        const pdfUrl = URL.createObjectURL(pdfBlob);
                        setPdfUrl(pdfUrl);
                    }, 1500);
                } else {
                    setPdfUrl(null);
                    console.clear();
                }
            } catch (error) {
                setPdfUrl(null);
                console.clear();
            }
        };

        fetchPdf();
    }, []);

    useEffect(() => {
        return () => {
            // Clean up the URL when the component is unmounted
            URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    return (
        <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
                <h2>{title}</h2>
            </div>
            <div className="pdf-viewer-content" style={!pdfUrl? {height: "200px"} : {}}>
                {
                    pdfUrl? (
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                            <div className="pdf-viewer">
                                <Viewer fileUrl={pdfUrl} />
                            </div>
                        </Worker>
                    ) : pdfUrl === null? (
                        <div className="pdf-viewer-error">
                            <h3>PDF not found</h3>
                        </div>
                    ) : (
                        <Loader />
                    )
                }
            </div>
        </div>
    );
};

export default PdfViewer;
