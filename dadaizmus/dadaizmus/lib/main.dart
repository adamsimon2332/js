import 'package:flutter/material.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: const Color(0xFFF8F8F8),
        body: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 32.0, horizontal: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _PoemCard(
                    author: 'Forró Kira',
                    title: 'Dadaizmus H betűkkel',
                    poem: '''Hét határon homály.
Hol hagytad hitvesed?
Három hegyen hallom hangod
hálátlan halk huhogását.
Hófehér halál honol.
Házam halkan hívogat.
Hiányzol.
Hiányzom?
Hólepte hazám
híreszteli hogy hányszor hallott
helyedet hagyva háborogni
hazátlanul.
Humor.
Hiba.
Hallasz hegedűdön
hangjegyeket hullani.
Hamar hozott hatalom.
Heroin.
Harc hullócsillagokkal.
Három herceg.
Három harc.
Három hulla.
Hólepte hegedű.
Hólepte hangjegyek.
Hólepte húrok.
Halott háború.
Határozott haszon.
Hős.
Hullaszínű hiányérzet.
Hiányzol.
Hiányzom?
Hallom határozott hangom:
HOZD HAZA.
Hagyd.
Hozd.
Hajolj hozzám.
Hiányzol...
Hallod halálhírem.
Hiányzom(?!)
Halott hull a határra.
HALOTT LETTÉL TE IS.''',
                  ),
                  const SizedBox(height: 50),
                  _PoemCard(
                    author: 'Molnár Jolán',
                    title: 'dadaisten',
                    poem: '''az isten
globál
golyóbist lóbál
elhittem
hogy él
golyó és kötél
mint sitten
nézni
hogyan tekézik
a hideg
rácson
nincs átjárásom
és minek
hittem
hogy lóbál isten
bármit is
ha már
az ujja halál''',
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PoemCard extends StatelessWidget {
  final String author;
  final String title;
  final String poem;

  const _PoemCard({
    required this.author,
    required this.title,
    required this.poem,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 500,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 28.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Color(0xFFE0E0E0), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontFamily: 'Georgia',
              fontWeight: FontWeight.bold,
              fontSize: 22,
              color: Color(0xFF2D2D2D),
              letterSpacing: 0.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            author,
            style: const TextStyle(
              fontFamily: 'Georgia',
              fontWeight: FontWeight.w500,
              fontSize: 16,
              color: Color(0xFF6A6A6A),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            poem,
            style: const TextStyle(
              fontFamily: 'Georgia',
              fontSize: 18,
              color: Color(0xFF222222),
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}