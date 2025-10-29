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
      // Capturar o certificado como imagem
      const canvas = await html2canvas(certificadoRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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
    <div className="space-y-6">
      {/* Botões de ação */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={baixarPDF}
              disabled={baixando}
              data-testid="button-baixar-certificado"
            >
              <Download className="h-5 w-5 mr-2" />
              {baixando ? 'Gerando PDF...' : 'Baixar Certificado em PDF'}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            Seu certificado será gerado em alta qualidade (formato A4 paisagem)
          </p>
        </CardContent>
      </Card>

      {/* Certificado */}
      <div
        ref={certificadoRef}
        className="bg-white shadow-2xl rounded-lg overflow-hidden border-8 border-double border-blue-900"
        style={{ aspectRatio: '1.414', minHeight: '600px' }}
      >
        {/* Header Decorativo */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 h-4"></div>
        
        <div className="p-12 md:p-16 h-full flex flex-col relative">
          {/* Marca d'água de fundo */}
          <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
            <Award className="h-96 w-96 text-blue-600" />
          </div>

          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Logo e Cabeçalho */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                CERTIFICADO
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-semibold">DE CONCLUSÃO DE CURSO</p>
              </div>
            </div>

            {/* Corpo do Certificado */}
            <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
              <p className="text-lg text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                Certificamos que
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2 inline-block mx-auto px-8" style={{ fontFamily: 'Georgia, serif' }}>
                {certificado.colaboradorNome}
              </h2>

              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                concluiu com êxito o curso de <strong>{curso.titulo}</strong>, 
                com carga horária de <strong>{certificado.cargaHoraria}</strong>, 
                ministrado pela plataforma <strong>HumaniQ AI</strong>.
              </p>

              <p className="text-base text-gray-600">
                Conforme Trilha de Capacitação - Liderança e Saúde Psicossocial (NR01)
              </p>
            </div>

            {/* Footer com informações */}
            <div className="mt-8 grid grid-cols-3 gap-8 border-t-2 border-gray-200 pt-8">
              {/* Coluna 1: Data e Local */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Data de Emissão</p>
                <p className="text-base font-semibold text-gray-900">{dataFormatada}</p>
                <p className="text-sm text-gray-600 mt-4">Plataforma Digital</p>
                <p className="text-sm font-semibold text-gray-900">HumaniQ AI</p>
              </div>

              {/* Coluna 2: QR Code */}
              <div className="flex flex-col items-center">
                {qrCodeDataUrl && (
                  <>
                    <img src={qrCodeDataUrl} alt="QR Code de Validação" className="w-24 h-24 mb-2" />
                    <p className="text-xs text-gray-600 text-center">
                      Escaneie para validar
                    </p>
                  </>
                )}
              </div>

              {/* Coluna 3: Assinatura e Código */}
              <div className="text-center">
                <div className="border-t-2 border-gray-900 pt-2 mb-2 mx-auto w-48">
                  <p className="text-sm font-semibold text-gray-900">{certificado.assinaturaDigital}</p>
                  <p className="text-xs text-gray-600">Diretor de Educação</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-600">Código de Autenticação:</p>
                  <p className="text-xs font-mono font-bold text-blue-700">{certificado.codigoAutenticacao}</p>
                </div>
              </div>
            </div>

            {/* Rodapé Institucional */}
            <div className="mt-6 text-center border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Certificado Válido e Autêntico</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                CNPJ: 00.000.000/0001-00 | www.humaniq.ai | contato@humaniq.ai
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Este certificado pode ser validado em: {certificado.qrCodeUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Decorativo */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 h-4"></div>
      </div>

      {/* Informações adicionais */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-green-900">Certificado Profissional Válido</h3>
              <ul className="text-sm text-green-800 space-y-1">
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
