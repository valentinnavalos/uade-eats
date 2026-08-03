import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

const SEED_STORE_OWNER_PASSWORD = "Password123"

async function main() {
  console.log("Limpiando base de datos...")
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany({ where: { role: "store_owner" } })
  await db.store.deleteMany()

  console.log("Agregando locales...")
  const rustica = await db.store.create({
    data: {
      name: "Rústica Pastelería",
      category: "pasteleria",
      tagline: "Pastelería artesanal y cafetería",
      imageUrl: "/images/pasteleria-claudio.jpg", // Using placeholder until real photo is obtained
      estimatedWaitMinutes: 5,
      isOpen: true,
      rating: 4.8,
    }
  })

  const cantina = await db.store.create({
    data: {
      name: "La Cantina",
      category: "buffet",
      tagline: "El clásico comedor universitario",
      imageUrl: "/images/comedor_4.jpg",
      estimatedWaitMinutes: 15,
      isOpen: true,
      rating: 4.2,
    }
  })

  console.log("Agregando categorías...")
  const rusticaPostres = await db.category.create({ data: { storeId: rustica.id, name: "Postres" } })
  const rusticaBebidas = await db.category.create({ data: { storeId: rustica.id, name: "Bebidas" } })
  const cantinaPlatos = await db.category.create({ data: { storeId: cantina.id, name: "Platos" } })
  const cantinaBebidas = await db.category.create({ data: { storeId: cantina.id, name: "Bebidas" } })

  console.log("Agregando productos a Rústica...")
  await db.product.createMany({
    data: [
      {
        storeId: rustica.id,
        name: "Porción de Chocotorta",
        description: "Clásica chocotorta argentina con dulce de leche y queso crema.",
        price: 4500,
        categoryId: rusticaPostres.id,
        imageUrl: "/images/products/brownie.jpg",
      },
      {
        storeId: rustica.id,
        name: "Alfajor de Maicena",
        description: "Relleno de abundante dulce de leche y coco rallado.",
        price: 1500,
        categoryId: rusticaPostres.id,
        imageUrl: "/images/products/medialunas.jpg",
      },
      {
        storeId: rustica.id,
        name: "Café de Especialidad",
        description: "Latte o Flat White con granos de origen.",
        price: 2500,
        categoryId: rusticaBebidas.id,
        imageUrl: "/images/products/cafe-con-leche.jpg",
      }
    ]
  })

  console.log("Agregando productos a La Cantina...")
  await db.product.createMany({
    data: [
      {
        storeId: cantina.id,
        name: "Milanesa con Puré",
        description: "Milanesa de carne o pollo con puré de papas.",
        price: 6500,
        categoryId: cantinaPlatos.id,
        imageUrl: "/images/products/sandwich-veggie.jpg",
      },
      {
        storeId: cantina.id,
        name: "Tarta de Jamón y Queso",
        description: "Porción abundante con ensalada mixta.",
        price: 5000,
        categoryId: cantinaPlatos.id,
        imageUrl: "/images/products/tostado-mixto.jpg",
      },
      {
        storeId: cantina.id,
        name: "Lata Coca-Cola",
        description: "Línea Coca-Cola 354ml fría.",
        price: 1500,
        categoryId: cantinaBebidas.id,
        imageUrl: "/images/products/jugo-naranja.jpg",
      }
    ]
  })

  console.log("Agregando usuarios de locales...")
  const passwordHash = await bcrypt.hash(SEED_STORE_OWNER_PASSWORD, 10)
  await db.user.create({
    data: {
      name: "Dueño Rústica Pastelería",
      email: "rustica@uade.edu.ar",
      passwordHash,
      role: "store_owner",
      storeId: rustica.id,
    },
  })
  await db.user.create({
    data: {
      name: "Dueño La Cantina",
      email: "cantina@uade.edu.ar",
      passwordHash,
      role: "store_owner",
      storeId: cantina.id,
    },
  })
  console.log(`Usuarios de locales creados (contraseña: ${SEED_STORE_OWNER_PASSWORD})`)

  console.log("¡Base de datos inicializada!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
