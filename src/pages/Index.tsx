import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

const packages = [
  {
    name: "Базовый",
    price: "15 000 ₽",
    priceValue: 15000,
    description: "Идеально для старта",
    features: [
      "Консультация 1 час",
      "Базовая настройка",
      "Поддержка 7 дней",
      "Email поддержка"
    ]
  },
  {
    name: "Стандарт",
    price: "35 000 ₽",
    priceValue: 35000,
    description: "Оптимальное решение",
    features: [
      "Консультация 3 часа",
      "Полная настройка",
      "Поддержка 30 дней",
      "Приоритетная поддержка",
      "Обучение команды"
    ],
    popular: true
  },
  {
    name: "Премиум",
    price: "75 000 ₽",
    priceValue: 75000,
    description: "Максимум возможностей",
    features: [
      "Безлимитные консультации",
      "Индивидуальная настройка",
      "Поддержка 90 дней",
      "Личный менеджер",
      "Обучение команды",
      "Техническая документация"
    ]
  }
];

const testimonials = [
  {
    name: "Анна Петрова",
    role: "Директор компании",
    text: "Отличный сервис! Всё сделали быстро и качественно. Команда профессионалов своего дела.",
    rating: 5
  },
  {
    name: "Михаил Иванов",
    role: "Предприниматель",
    text: "Результат превзошёл ожидания. Рекомендую всем, кто ценит качество и оперативность.",
    rating: 5
  },
  {
    name: "Елена Смирнова",
    role: "Маркетолог",
    text: "Профессиональный подход к делу. Всё объяснили понятно, помогли на каждом этапе.",
    rating: 5
  }
];

const Index = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleBuyClick = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setIsPaymentOpen(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6e8d770f-759a-4c81-aa10-18576fd481ec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPackage.priceValue,
          package_name: selectedPackage.name,
          customer_email: formData.email,
          customer_name: formData.name,
          customer_phone: formData.phone
        })
      });
      
      const data = await response.json();
      
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        alert('Ошибка при создании платежа. Попробуйте позже.');
      }
    } catch (error) {
      alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Услуги</div>
          <div className="hidden md:flex gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#packages" className="text-foreground hover:text-primary transition-colors">Пакеты</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Отзывы</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О нас</a>
          </div>
          <Button size="sm">Связаться</Button>
        </div>
      </nav>

      <section id="home" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Профессиональные услуги для вашего бизнеса
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light">
              Помогаем компаниям расти и развиваться с помощью современных решений
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="text-lg px-8 py-6">
                Начать сейчас
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-scale-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Zap" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстро</h3>
              <p className="text-muted-foreground">Оперативное выполнение всех задач</p>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Надёжно</h3>
              <p className="text-muted-foreground">Гарантия качества работ</p>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Забота</h3>
              <p className="text-muted-foreground">Индивидуальный подход к каждому</p>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Пакеты услуг</h2>
            <p className="text-xl text-muted-foreground">Выберите подходящий вариант</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative transition-all hover:shadow-xl hover:-translate-y-1 ${
                  pkg.popular ? 'border-primary border-2 shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Популярный
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="text-4xl font-bold text-primary mt-4">{pkg.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleBuyClick(pkg)}
                  >
                    Купить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Отзывы клиентов</h2>
            <p className="text-xl text-muted-foreground">Что говорят о нас</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Icon key={i} name="Star" size={18} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">О нас</h2>
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Мы — команда профессионалов с многолетним опытом работы в сфере бизнес-консалтинга 
                и цифровых решений. Наша миссия — помогать компаниям достигать амбициозных целей 
                через инновационные подходы и персонализированный сервис.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                За годы работы мы помогли более 200 компаниям оптимизировать процессы, 
                внедрить новые технологии и увеличить прибыль. Наш подход основан на глубоком 
                понимании бизнеса клиента и использовании проверенных методологий.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">200+</div>
                  <div className="text-muted-foreground">Довольных клиентов</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">5 лет</div>
                  <div className="text-muted-foreground">На рынке</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Успешных проектов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl mb-8 opacity-90">Свяжитесь с нами и получите консультацию</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Связаться с нами
          </Button>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2024 Услуги. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оплата услуги</DialogTitle>
            <DialogDescription>
              {selectedPackage && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">{selectedPackage.name}</div>
                      <div className="text-sm">{selectedPackage.description}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{selectedPackage.price}</div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя и фамилия</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isProcessing}
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                После нажатия кнопки вы будете перенаправлены на безопасную страницу оплаты ЮKassa
              </p>
              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Создание платежа...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Перейти к оплате {selectedPackage?.price}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;