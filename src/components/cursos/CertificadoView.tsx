import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, CheckCircle2, Shield } from "lucide-react";
import { Curso } from "@/data/cursosData";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "@/components/Logo";

interface CertificadoViewProps {
  certificado: any;
  curso: Curso;
}

export default function CertificadoView({ certificado, curso }: CertificadoViewProps) {
  const certificadoRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [baixando, setBaixando] = useState(false);

  useEffect(() => {
    // Gerar QR Code
    if (certificado?.qrCodeUrl) {
      QRCode.toDataURL(certificado.qrCodeUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      }).then(setQrCodeDataUrl).catch(console.error);
    }
  }, [certificado]);

  const baixarPDF = async () => {
    if (!certificadoRef.current) return;
    
    setBaixando(true);
    try {
      // Capturar o certificado como imagem com alta qualidade
      const canvas = await html2canvas(certificadoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200,
        windowHeight: 850,
      });

      // Criar PDF em orientação paisagem A4
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      // Calcular proporções para preencher o PDF sem distorção
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`certificado-${curso.slug}-${certificado.codigoAutenticacao}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setBaixando(false);
    }
  };

  const dataFormatada = new Date(certificado.dataEmissao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 px-2 sm:px-4">
      {/* Botões de ação */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Button
              size="lg"
              className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
              onClick={baixarPDF}
              disabled={baixando}
              data-testid="button-baixar-certificado"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {baixando ? 'Gerando PDF...' : 'Baixar Certificado em PDF'}
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 md:mt-3 text-center">
            Seu certificado será gerado em alta qualidade (formato A4 paisagem)
          </p>
        </CardContent>
      </Card>

      {/* Certificado - 100% Responsivo e otimizado para PDF */}
      <div className="w-full overflow-x-auto">
        <div
          ref={certificadoRef}
          className="bg-white shadow-2xl rounded-lg overflow-hidden border-4 sm:border-6 md:border-8 border-double border-blue-900 w-full"
          style={{ 
            minWidth: '280px',
            maxWidth: '1200px',
            margin: '0 auto',
            aspectRatio: '1.414'
          }}
        >
          {/* Header Decorativo */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 h-2 sm:h-3 md:h-4"></div>
          
          <div className="p-4 sm:p-6 md:p-10 lg:p-16 relative">
            {/* Marca d'água de fundo */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <Award className="h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-96 lg:w-96 text-blue-600" />
            </div>

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
              {/* Logo e Cabeçalho */}
              <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                  <Logo size="lg" className="scale-75 sm:scale-90 md:scale-100" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  CERTIFICADO
                </h1>
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <p className="text-xs sm:text-sm md:text-base font-semibold">DE CONCLUSÃO DE CURSO</p>
                </div>
              </div>

              {/* Corpo do Certificado */}
              <div className="flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-6 text-center py-4 sm:py-6 md:py-8">
                <p className="text-sm sm:text-base md:text-lg text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificamos que
                </p>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2 inline-block mx-auto px-4 sm:px-6 md:px-8" style={{ fontFamily: 'Georgia, serif' }}>
                  {certificado.colaboradorNome}
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4" style={{ fontFamily: 'Georgia, serif' }}>
                  concluiu com êxito o curso de <strong>{curso.titulo}</strong>, 
                  com carga horária de <strong>{certificado.cargaHoraria}</strong>, 
                  ministrado pela plataforma <strong>HumaniQ AI</strong>.
                </p>

                <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2">
                  Conforme Trilha de Capacitação - Liderança e Saúde Psicossocial (NR01)
                </p>
              </div>

              {/* Footer com informações - Responsivo */}
              <div className="border-t-2 border-gray-200 pt-4 sm:pt-6 md:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {/* Coluna 1: Data e Local */}
                  <div className="text-center space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600">Data de Emissão</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{dataFormatada}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4">Plataforma Digital</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">HumaniQ AI</p>
                  </div>

                  {/* Coluna 2: QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    {qrCodeDataUrl && (
                      <>
                        <img src={qrCodeDataUrl} alt="QR Code de Validação" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2" />
                        <p className="text-xs text-gray-600 text-center">
                          Escaneie para validar
                        </p>
                      </>
                    )}
                  </div>

                  {/* Coluna 3: Certificação e Código */}
                  <div className="text-center space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                    <div className="pt-2 mb-2 mx-auto">
                      {/* Assinatura manuscrita elegante */}
                      <div className="mb-3 flex justify-center">
                        <svg width="180" height="60" viewBox="0 0 180 60" className="w-36 sm:w-44 md:w-48" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                              <stop offset="50%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                            </linearGradient>
                          </defs>
                          <text 
                            x="90" 
                            y="40" 
                            fontSize="32" 
                            fontFamily="'Brush Script MT', 'Lucida Handwriting', cursive" 
                            fontStyle="italic"
                            fontWeight="bold"
                            fill="url(#signatureGradient)" 
                            textAnchor="middle"
                            transform="rotate(-2 90 30)"
                          >
                            HumaniQ AI
                          </text>
                        </svg>
                      </div>
                      {/* Linha de assinatura */}
                      <div className="border-t-2 border-gray-900 pt-2 mx-auto w-40 sm:w-48">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">Certificado por HumaniQ AI</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Código de Autenticação:</p>
                      <p className="text-xs font-mono font-bold text-blue-700 break-all px-2">{certificado.codigoAutenticacao}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé Institucional */}
              <div className="text-center border-t border-gray-200 pt-3 sm:pt-4 space-y-1 sm:space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span>Certificado Válido e Autêntico</span>
                </div>
                <p className="text-xs text-gray-400 break-all px-2">
                  Este certificado pode ser validado em: {certificado.qrCodeUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Decorativo */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 h-2 sm:h-3 md:h-4"></div>
        </div>
      </div>

      {/* Informações adicionais */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-green-900">Certificado Profissional Válido</h3>
              <ul className="text-xs sm:text-sm text-green-800 space-y-1">
                <li>✓ Código de autenticação único</li>
                <li>✓ QR Code para validação online</li>
                <li>✓ Registro em blockchain (em breve)</li>
                <li>✓ Reconhecido nacionalmente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
