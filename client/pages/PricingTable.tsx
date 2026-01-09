import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  DollarSign,
  Home,
  Building2,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  RefreshCw,
  Loader2,
  Info,
  Calendar,
  Car,
  Globe,
  Bookmark,
  Palette,
  ChevronDown,
} from "lucide-react";

interface PricingRow {
  code: string;
  vehicleType: string;
  category?: string;
  duration?: string;
  netPremium: number;
  stampFee: number;
  warEffort: number;
  localAdministration: number;
  reconstruction: number;
  martyrFund: number;
  total: number;
  label?: string;
}

type PricingType = "internal" | "border";

export default function PricingTable() {
  const navigate = useNavigate();
  const [pricingData, setPricingData] = useState<Record<string, PricingRow>>({});
  const [pricingType, setPricingType] = useState<PricingType>("internal");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const employeeName = localStorage.getItem("employeeName") || "";
  const centerName = localStorage.getItem("centerName") || "";

  // Load pricing data from localStorage (سيتم استبداله بقراءة من Excel)
  useEffect(() => {
    const loadPricingData = () => {
      try {
        const savedData = localStorage.getItem("pricingTable");
        if (savedData) {
          setPricingData(JSON.parse(savedData));
        } else {
          // بيانات تجريبية للعرض
          const mockData: Record<string, PricingRow> = {
            "01-01": {
              code: "01-01",
              vehicleType: "سيارية",
              category: "01",
              netPremium: 100000,
              stampFee: 5000,
              warEffort: 10000,
              localAdministration: 5000,
              reconstruction: 5000,
              martyrFund: 5000,
              total: 130000,
              label: "سيارية قوة محرك حتى 20",
            },
            "01-02": {
              code: "01-02",
              vehicleType: "نقل وركوب",
              category: "01",
              netPremium: 120000,
              stampFee: 6000,
              warEffort: 12000,
              localAdministration: 6000,
              reconstruction: 6000,
              martyrFund: 6000,
              total: 156000,
              label: "نقل وركوب قوة محرك حتى 20",
            },
          };
          setPricingData(mockData);
        }
      } catch (e) {
        console.error("Error loading pricing data:", e);
        setError("حدث خطأ في تحميل بيانات التسعير");
      }
    };

    loadPricingData();
  }, []);

  // Filter pricing data
  const filteredData = useMemo(() => {
    let filtered = Object.values(pricingData);

    // Filter by type
    if (pricingType === "internal") {
      filtered = filtered.filter((row) => row.category);
    } else {
      filtered = filtered.filter((row) => !row.category);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((row) => row.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.code.toLowerCase().includes(term) ||
          row.vehicleType.toLowerCase().includes(term) ||
          row.label?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => a.code.localeCompare(b.code));
  }, [pricingData, pricingType, categoryFilter, searchTerm]);

  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("ar-SY").format(Math.round(amount))} ل.س`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("الرجاء اختيار ملف Excel (.xlsx أو .xls)");
      return;
    }

    setIsLoading(true);
    setError("");

    // TODO: إضافة منطق قراءة ملف Excel هنا
    // سيتم استخدام مكتبة xlsx لقراءة الملف
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const data = e.target?.result;
    //   // معالجة البيانات...
    // };
    // reader.readAsArrayBuffer(file);

    setTimeout(() => {
      setIsLoading(false);
      setError("سيتم إضافة منطق قراءة ملف Excel قريباً");
    }, 1000);
  };

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "01", label: "خاصة (أفراد)" },
    { value: "02", label: "عامة (تجارية)" },
    { value: "03", label: "حكومية" },
    { value: "04", label: "تأجير" },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">جدول التسعير</h1>
                <p className="text-sm text-gray-800">عرض وإدارة أسعار التأمين</p>
              </div>
            </div>

            <div className="text-right text-gray-800">
              <div className="text-sm font-semibold">المركز: <span className="text-primary-700">{centerName || "—"}</span></div>
              <div className="text-xs text-gray-600 mt-1">الموظف: {employeeName || "—"}</div>
            </div>

            <div className="flex items-center gap-2">
              {/* السجلات */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-primary-600 hover:bg-primary-700 text-white border-primary-600 h-9">
                    <FileText className="w-4 h-4 ml-2" />
                    السجلات
                    <ChevronDown className="w-4 h-4 mr-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>السجلات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/records")} className="text-right cursor-pointer">
                    <FileText className="w-4 h-4 ml-2" />
                    جميع السجلات
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/syrian-records")} className="text-right cursor-pointer">
                    <Car className="w-4 h-4 ml-2" />
                    السجلات السورية
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/foreign-records")} className="text-right cursor-pointer">
                    <Globe className="w-4 h-4 ml-2" />
                    السجلات الأجنبية
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/reserved-vehicles")} className="text-right cursor-pointer">
                    <Bookmark className="w-4 h-4 ml-2" />
                    السيارات المحجوزة
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* الأدلة */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-primary-600 hover:bg-primary-700 text-white border-primary-600 h-9">
                    <Search className="w-4 h-4 ml-2" />
                    الأدلة
                    <ChevronDown className="w-4 h-4 mr-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>الأدلة المرجعية</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/vehicle-types-guide")} className="text-right cursor-pointer">
                    <Search className="w-4 h-4 ml-2" />
                    دليل النوع والموديل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/colors-guide")} className="text-right cursor-pointer">
                    <Palette className="w-4 h-4 ml-2" />
                    دليل الألوان
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* الإدارة */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-primary-700 hover:bg-primary-800 text-white border-primary-700 h-9">
                    <Building2 className="w-4 h-4 ml-2" />
                    الإدارة
                    <ChevronDown className="w-4 h-4 mr-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>الإدارة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/companies")} className="text-right cursor-pointer">
                    <Building2 className="w-4 h-4 ml-2" />
                    شركات التأمين
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* زر الرئيسية */}
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="bg-primary-600 hover:bg-primary-700 text-white border-primary-600 h-9"
              >
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters and Actions */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              الفلاتر والإجراءات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>نوع التأمين</Label>
                <Select value={pricingType} onValueChange={(value) => setPricingType(value as PricingType)}>
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">داخلي</SelectItem>
                    <SelectItem value="border">حدودي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pricingType === "internal" && (
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label>البحث</Label>
                <Input
                  placeholder="ابحث بالرمز، نوع المركبة، أو الوصف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="flex-1 text-sm text-gray-600">
                تم العثور على {filteredData.length} سطر من أصل {Object.keys(pricingData).length}
              </div>
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جارٍ التحميل...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 ml-2" />
                    رفع ملف Excel
                  </>
                )}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                <Download className="w-4 h-4 ml-2" />
                طباعة / تصدير
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              جدول الأسعار ({pricingType === "internal" ? "داخلي" : "حدودي"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">لا توجد بيانات تسعير متاحة</p>
                <p className="text-sm mt-2">يرجى رفع ملف Excel لتحديث البيانات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرمز</TableHead>
                      <TableHead>نوع المركبة</TableHead>
                      {pricingType === "internal" && <TableHead>الفئة</TableHead>}
                      {pricingType === "border" && <TableHead>المدة</TableHead>}
                      <TableHead>الوصف</TableHead>
                      <TableHead className="text-left">البدل الصافي</TableHead>
                      <TableHead className="text-left">رسم الطابع</TableHead>
                      <TableHead className="text-left">مجهود حربي</TableHead>
                      <TableHead className="text-left">الإدارة المحلية</TableHead>
                      <TableHead className="text-left">إعمار</TableHead>
                      <TableHead className="text-left">طابع شهيد</TableHead>
                      <TableHead className="text-left font-bold">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow key={row.code}>
                        <TableCell className="font-medium" dir="ltr">{row.code}</TableCell>
                        <TableCell>{row.vehicleType}</TableCell>
                        {pricingType === "internal" && (
                          <TableCell>
                            <Badge variant="secondary">
                              {row.category === "01" ? "خاصة" : row.category === "02" ? "عامة" : row.category === "03" ? "حكومية" : "تأجير"}
                            </Badge>
                          </TableCell>
                        )}
                        {pricingType === "border" && (
                          <TableCell>{row.duration || "—"}</TableCell>
                        )}
                        <TableCell>{row.label || "—"}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.netPremium)}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.stampFee)}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.warEffort)}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.localAdministration)}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.reconstruction)}</TableCell>
                        <TableCell className="text-left font-mono" dir="ltr">{formatCurrency(row.martyrFund)}</TableCell>
                        <TableCell className="text-left font-bold font-mono text-primary-700" dir="ltr">
                          {formatCurrency(row.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 shadow-lg bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Info className="w-5 h-5" />
              معلومات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 text-right">
              هذا الجدول يعرض أسعار التأمين الإلزامي للمركبات.
              يمكنك تصدير البيانات أو طباعتها مباشرة.
              لرفع ملف Excel جديد، استخدم زر "رفع ملف Excel" أعلاه.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
